<?php
namespace Application\Controller;

use TypeError;
use LeoGalleguillos\ThreeDimensions\Model\Entity as ThreeDimensionsEntity;
use LeoGalleguillos\ThreeDimensions\Model\Factory as ThreeDimensionsFactory;
use LeoGalleguillos\ThreeDimensions\Model\Service as ThreeDimensionsService;
use LeoGalleguillos\ThreeDimensions\Model\Table as ThreeDimensionsTable;
use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Mannequin extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsFactory\Mannequin $mannequinFactory,
        ThreeDimensionsService\Mannequin\Json $mannequinJsonService,
        ThreeDimensionsTable\Mannequin $mannequinTable,
        UserFactory\User\BuildFromCookies $buildFromCookiesFactory
    ) {
        $this->mannequinFactory        = $mannequinFactory;
        $this->mannequinJsonService    = $mannequinJsonService;
        $this->mannequinTable          = $mannequinTable;
        $this->buildFromCookiesFactory = $buildFromCookiesFactory;
    }

    public function buildFromUserIdAction()
    {
        $userEntity      = $this->buildFromCookiesFactory->buildFromCookies();
        try {
            $mannequinEntity = $this->mannequinFactory->buildFromUserId(
                $userEntity->getUserId()
            );
        } catch (TypeError $typeError) {
            $mannequinEntity = new ThreeDimensionsEntity\Mannequin();
        }

        $this->getResponse()->getHeaders()->addHeaderLine('Content-type', 'application/json');

        return [
            'jsonString' => json_encode($mannequinEntity),
        ];
    }

    public function updateWhereUserIdAction()
    {
        $userEntity  = $this->buildFromCookiesFactory->buildFromCookies();
        $this->mannequinTable->updateWhereUserId(
            $_POST['translateX'],
            $_POST['translateY'],
            $_POST['translateZ'],
            $_POST['rotateX'],
            $_POST['rotateY'],
            $_POST['rotateZ'],
            $_POST['transformOriginX'],
            $_POST['transformOriginY'],
            $_POST['transformOriginZ'],
            $userEntity->getUserId()
        );

        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
