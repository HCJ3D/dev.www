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

class Tmp extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsTable\Ground $groundTable
    ) {
        $this->groundTable = $groundTable;
    }

    public function indexAction()
    {
        $rotateX = $rotateY = $rotateZ = $translateZ = 0;

        /**
        for ($translateX = 0; $translateX <= 6000; $translateX += 1000) {
            for ($translateY = 0; $translateY <= 6000; $translateY += 1000) {
                $backgroundColorRgbR = rand(0, 255);
                $backgroundColorRgbG = rand(0, 255);
                $backgroundColorRgbB = rand(0, 255);
                $rotateX = 0;
                $rotateY = 0;
                $rotateZ = 0;
                // $translateX
                // $translateY
                $translateZ = 0;
                $transformOriginX = 0;
                $transformOriginY = 0;
                $transformOriginZ = 0;
                $this->groundTable->insert(
                    $backgroundColorRgbR,
                    $backgroundColorRgbG,
                    $backgroundColorRgbB,
                    $rotateX,
                    $rotateY,
                    $rotateZ,
                    $translateX,
                    $translateY,
                    $translateZ,
                    $transformOriginX,
                    $transformOriginY,
                    $transformOriginZ
                );
            }
        }
         */
    }
}
